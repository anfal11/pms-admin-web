
export const RuleDataReFormat = (userInput, flexibleData) => {

    const {
        cashbackFlexibleData,
        voucherFlexibleData,
        datapackFlexibleData,
        pointFlexibleData
    } = flexibleData

    const {
        commissionRuleName,
        reward_type,

        isFinBasedOffer,
        target,
        isQuota,
        isRxQuota,
        isCertainTimeline,
        isTime,
        commissionType

    } = userInput

    let {
        pointExpireDays,

        offer_type,
        offerCount,
        offerAmount,

        target_type,
        target_count,
        target_amount,

        quotaType,
        quotaCount,
        quotaAmount,

        rxQuotaType,
        rxQuotaCount,
        rxQuotaAmount,

        timelineType,
        isTimelineRange,
        staticTimeline,
        startTimeline,
        endTimeline,

        startHour,
        endHour,
        outsideHourCommissionId,
        returnCertainTimelineId,

        flexibleRules,

        isPercentage,
        snAmount,
        rxAmount,
        min,
        max,

        snreward_datapack_groupid,
        rxreward_datapack_groupid,

        snreward_voucherid,
        rxreward_voucherid

    } = userInput


    // Add Transaction Reachable Target?
    if (!isFinBasedOffer) {
        offer_type = 0
        offerCount = 0
        offerAmount = 0
    }

    // Set Cumulative Target?
    if (!target) {
        target_type = 0
        target_count = 0
        target_amount = 0
    }

    // Set Campaign Reward Quota?
    if (!isQuota) {
        quotaType = 0
        quotaCount = 0
        quotaAmount = 0
    }

    // Set Receiver Reward Quota?
    if (!isRxQuota) {
        rxQuotaType = 0
        rxQuotaCount = 0
        rxQuotaAmount = 0
    }

    /* 
       Set Recurring Timeline?
       returnCertainTimelineId => off hour rule => optional..
       timelineType = w/m
       isTimelineRange = false=> Specific Day, true => Day Range

       //for specific date
       staticTimeline => 1/2/3/4/....
      //For date range..
       startTimeline => 1/2/3/4....
       endTimeline => 1/2/3/4...
    */
    if (!isCertainTimeline) {
        returnCertainTimelineId = 0
        timelineType = null
        isTimelineRange = false
        staticTimeline = null
        startTimeline = null
        endTimeline = null
    } else {

        if (!isTimelineRange) {
            startTimeline = null
            endTimeline = null
        } else {
            staticTimeline = null
        }
    }

    if (!isTime) {
        startHour = null
        endHour = null
        outsideHourCommissionId = 0
    }

    if (isCertainTimeline && isTime) {
        outsideHourCommissionId = returnCertainTimelineId
    }

    /*
      commissionType = fixed / flexible
      reward type => 1=voucher,2=datapck,3=point,4=cashback
    */
   if (commissionType === 'fixed') {
    flexibleRules = []
    switch (reward_type) {
        case 1 :
            isPercentage = false
            snAmount = 0  //also for point
            rxAmount = 0   //also for point
            min = 0
            max = 0
            pointExpireDays = 0

            snreward_datapack_groupid = 0
            rxreward_datapack_groupid = 0

            break

        case 2 :
            isPercentage = false
            snAmount = 0  //also for point
            rxAmount = 0   //also for point
            min = 0
            max = 0
            pointExpireDays = 0

            snreward_voucherid = 0
            rxreward_voucherid = 0

            break

        case 3 : 
             isPercentage = false
             min = 0
             max = 0

             snreward_datapack_groupid = 0
             rxreward_datapack_groupid = 0

             snreward_voucherid = 0
             rxreward_voucherid = 0

             break
        
        default :
             pointExpireDays = 0
             
             snreward_datapack_groupid = 0
             rxreward_datapack_groupid = 0

             snreward_voucherid = 0
             rxreward_voucherid = 0
             if (!isPercentage) {
                min = 0
                max = 0
             }
      }
   } else {
    // For flexiable..
    // cash-back...
      isPercentage = false
      snAmount = 0  //also for point
      rxAmount = 0   //also for point
      min = 0
      max = 0

    //voucher...
      snreward_voucherid = 0
      rxreward_voucherid = 0

    // Data-pack...
      snreward_datapack_groupid = 0
      rxreward_datapack_groupid = 0

      switch (reward_type) {
        case 1 :
            flexibleRules = voucherFlexibleData
            pointExpireDays = 0
            break

        case 2 :
            flexibleRules = datapackFlexibleData
            pointExpireDays = 0
            break

        case 3 : 
             flexibleRules = pointFlexibleData
             break
        
        default :
             flexibleRules = cashbackFlexibleData
             pointExpireDays = 0
      }

   }

   const finalRequestData = {
        commissionRuleName,
        reward_type,
        pointExpireDays,

        isFinBasedOffer,
        offer_type,
        offerCount,
        offerAmount,

        target,
        target_type,
        target_count,
        target_amount,

        isQuota,
        quotaType,
        quotaCount,
        quotaAmount,

        isRxQuota,
        rxQuotaType,
        rxQuotaCount,
        rxQuotaAmount,

        isCertainTimeline,
        isTimelineRange,
        staticTimeline,
        startTimeline,
        endTimeline,

        timelineType,
        startHour,
        endHour,
        returnCertainTimelineId,

        isTime,
        startHour,
        endHour,
        outsideHourCommissionId,

        commissionType,
        flexibleRules,

        isPercentage,
        snAmount,
        rxAmount,
        min,
        max,

        snreward_datapack_groupid,
        rxreward_datapack_groupid,

        snreward_voucherid,
        rxreward_voucherid
   }

   return finalRequestData
}